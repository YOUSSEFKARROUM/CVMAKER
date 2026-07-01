import Anthropic from '@anthropic-ai/sdk';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

const MODEL = process.env.AI_MODEL || 'claude-sonnet-4-6';
const MAX_TOKENS = Number.parseInt(process.env.AI_MAX_TOKENS || '2000', 10);

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Trop de requetes IA. Reessayez dans 15 minutes.' },
});

const jsonActions = new Set([
  'suggest-skills',
  'suggest-job-titles',
  'detect-gaps',
  'polish-all',
  'translate-cv',
  'optimize-ats',
  'improve-languages',
]);

router.use(aiLimiter);

router.post('/generate', async (req, res) => {
  try {
    const { action, data, language = 'fr' } = req.body ?? {};

    if (!action || !data) {
      return res.status(400).json({ error: 'action et data sont requis' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configure.' });
    }

    const prompts = buildPrompts(action, data, language);
    if (!prompts) {
      return res.status(400).json({ error: `Action inconnue: ${action}` });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: Number.isFinite(MAX_TOKENS) ? MAX_TOKENS : 2000,
      system: prompts.system,
      messages: [{ role: 'user', content: prompts.user }],
    });

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();

    if (jsonActions.has(action)) {
      try {
        const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
        return res.json({ result: JSON.parse(cleaned) });
      } catch {
        return res.json({ result: text });
      }
    }

    return res.json({ result: text });
  } catch (err) {
    console.error('AI Error:', err);
    if (err?.status === 429) {
      return res.status(429).json({ error: 'Limite API atteinte. Reessayez plus tard.' });
    }
    return res.status(500).json({ error: 'Erreur du service IA.' });
  }
});

function list(items, mapper) {
  return Array.isArray(items) && items.length
    ? items.map(mapper).join('\n')
    : 'Aucun';
}

function buildPrompts(action, data, lang) {
  const isEn = lang === 'en';
  const languageInstruction = isEn ? 'Write in English.' : 'Redige en francais.';

  switch (action) {
    case 'generate-profile':
      return {
        system: `Tu es un expert en redaction de CV professionnels.
Genere un resume professionnel de 3-4 phrases.
Utilise un ton professionnel mais dynamique.
Mentionne les competences cles, l'experience et la valeur ajoutee.
${languageInstruction}
Retourne uniquement le texte du resume, sans guillemets ni preambule.`,
        user: `Informations du candidat:
- Nom: ${data.firstName ?? ''} ${data.lastName ?? ''}
- Poste vise: ${data.jobTitle || 'Non specifie'}
- Experiences: ${list(data.experiences, (e) => `${e.jobTitle} chez ${e.employer}`)}
- Competences: ${list(data.skills, (s) => s.name)}
- Formation: ${list(data.educations, (e) => `${e.diploma} - ${e.school}`)}

Genere le resume professionnel.`,
      };

    case 'improve-experience':
      return {
        system: `Tu es un expert en redaction de CV.
Ameliore cette description d'experience professionnelle.
Regles:
- Commence chaque bullet point par un verbe d'action fort
- Ajoute des resultats chiffres quand possible, sans inventer
- Maximum 4-5 bullet points
- Chaque bullet = 1-2 lignes max
- Ton professionnel et concis
${languageInstruction}
Retourne uniquement les bullet points avec un point au debut, sans preambule.`,
        user: `Poste: ${data.jobTitle || 'Non specifie'}
Entreprise: ${data.employer || 'Non specifiee'}
Description actuelle: ${data.description || 'Aucune'}
${data.sector ? `Secteur: ${data.sector}` : ''}

Ameliore cette description.`,
      };

    case 'optimize-ats':
      return {
        system: `Tu es un expert en optimisation de CV pour les ATS.
Analyse l'offre d'emploi et le CV du candidat.
Retourne un JSON avec cette structure exacte:
{
  "matchScore": 75,
  "missingKeywords": ["mot1", "mot2"],
  "suggestedChanges": [
    { "section": "profile", "current": "texte actuel", "suggested": "texte ameliore" },
    { "section": "experience", "index": 0, "field": "description", "suggested": "texte ameliore" }
  ],
  "newSkills": ["competence1", "competence2"],
  "tips": ["conseil1", "conseil2"]
}
${languageInstruction}
Retourne uniquement le JSON, sans markdown.`,
        user: `OFFRE D'EMPLOI:
${data.jobOffer || ''}

CV DU CANDIDAT:
Poste actuel: ${data.jobTitle || 'Non specifie'}
Profil: ${data.profile || 'Aucun'}
Experiences: ${JSON.stringify(data.experiences?.slice?.(0, 3) ?? [])}
Competences: ${list(data.skills, (s) => s.name)}

Analyse et optimise.`,
      };

    case 'suggest-skills':
      return {
        system: `Tu es un expert en recrutement.
Suggere des competences pertinentes que le candidat devrait ajouter a son CV.
Retourne un JSON avec cette structure:
{
  "suggested": [
    { "name": "Competence", "reason": "Pourquoi l'ajouter", "level": "intermediate" }
  ],
  "toRemove": [
    { "name": "Competence", "reason": "Pourquoi la retirer" }
  ]
}
Les niveaux possibles sont "beginner", "intermediate", "advanced", "expert".
${languageInstruction}
Retourne uniquement le JSON.`,
        user: `Poste vise: ${data.jobTitle || 'Non specifie'}
Competences actuelles: ${list(data.skills, (s) => `${s.name} (${s.level})`)}
Experiences: ${list(data.experiences, (e) => e.jobTitle)}
Secteur: ${data.sector || 'Non specifie'}

Suggere des competences.`,
      };

    case 'translate-cv':
      return {
        system: `Tu es un traducteur professionnel specialise dans les CV.
Traduis tout le contenu du CV de ${data.sourceLang === 'fr' ? 'francais vers anglais' : 'anglais vers francais'}.
Regles:
- Garde le ton professionnel
- Adapte les expressions idiomatiques
- Les noms propres restent tels quels
- Les acronymes techniques restent en anglais
Retourne un JSON avec exactement la meme structure que l'input, mais avec les textes traduits.
Retourne uniquement le JSON, sans markdown.`,
        user: `Contenu du CV a traduire:
${JSON.stringify(data.cvContent ?? {}, null, 2)}

Traduis tout.`,
      };

    case 'generate-cover-letter':
      return {
        system: `Tu es un expert en redaction de lettres de motivation.
Genere une lettre professionnelle et personnalisee.
Structure:
1. Objet
2. Introduction
3. Competences pertinentes
4. Realisations concretes
5. Motivation pour l'entreprise
6. Conclusion avec appel a l'action
Formules de politesse incluses.
${languageInstruction}
Retourne uniquement le texte de la lettre.`,
        user: `CANDIDAT:
Nom: ${data.firstName ?? ''} ${data.lastName ?? ''}
Poste actuel: ${data.jobTitle || 'Non specifie'}
Profil: ${data.profile || 'Aucun'}
Experiences:
${list(data.experiences, (e) => `${e.jobTitle} chez ${e.employer}: ${e.description}`)}
Competences: ${list(data.skills, (s) => s.name)}

OFFRE D'EMPLOI:
${data.jobOffer || ''}

${data.companyName ? `Entreprise: ${data.companyName}` : ''}
Ton souhaite: ${data.tone || 'professional'}

Genere la lettre de motivation.`,
      };

    case 'improve-languages':
      return {
        system: `Tu es un expert en CV.
Pour chaque langue, reformule le niveau en une description contextuelle professionnelle.
Exemple: "Anglais - Avance" -> "Anglais professionnel - redaction technique, presentations clients, documentation en anglais".
${languageInstruction}
Retourne un JSON: [{ "name": "...", "level": "...", "description": "..." }]
Retourne uniquement le JSON.`,
        user: `Langues du candidat:
${list(data.languages, (l) => `${l.name} - ${l.level}`)}
Poste vise: ${data.jobTitle || 'Non specifie'}
Secteur: ${data.sector || 'Non specifie'}

Reformule les niveaux.`,
      };

    case 'polish-all':
      return {
        system: `Tu es un expert senior en redaction de CV avec 20 ans d'experience.
Tu recois un CV complet. Ta mission: polir chaque section sans changer le fond.
Regles strictes:
- Ne change pas les faits
- Ne supprime pas de contenu
- N'invente aucune information
- Corrige les fautes
- Ameliore la formulation pour etre plus professionnel et impactant
- Harmonise le ton sur tout le CV
- Raccourcis les phrases trop longues
Retourne un JSON avec exactement cette structure:
{
  "profile": "profil reecrit",
  "experiences": [{ "id": "id_original", "jobTitle": "titre corrige", "description": "description amelioree" }],
  "educations": [{ "id": "id_original", "diploma": "diplome corrige" }],
  "skills": [{ "id": "id_original", "name": "nom corrige" }],
  "projects": [{ "id": "id_original", "name": "nom corrige", "description": "description amelioree" }],
  "interests": ["interet 1 reformule"],
  "changes": ["Liste des changements effectues"]
}
${languageInstruction}
Retourne uniquement le JSON, sans markdown.`,
        user: `CV COMPLET A POLIR:

PROFIL:
${data.profile || 'Aucun profil'}

EXPERIENCES:
${list(data.experiences, (e) => `[${e.id}] ${e.jobTitle} chez ${e.employer} (${e.startDate} - ${e.endDate || 'Present'})
${e.description || 'Pas de description'}`)}

FORMATIONS:
${list(data.educations, (e) => `[${e.id}] ${e.diploma} - ${e.school} (${e.graduationDate})`)}

COMPETENCES:
${list(data.skills, (s) => `[${s.id}] ${s.name} (${s.level})`)}

PROJETS:
${list(data.projects, (p) => `[${p.id}] ${p.name}
${p.description || 'Pas de description'}
Technologies: ${p.technologies?.join(', ') || 'Non specifiees'}`)}

CENTRES D'INTERET:
${Array.isArray(data.interests) && data.interests.length ? data.interests.join(', ') : 'Aucun'}

LANGUES:
${list(data.languages, (l) => `${l.name} - ${l.level}`)}

Polis tout le CV.`,
      };

    default:
      return null;
  }
}

export default router;
