# Rapport detaille - Probleme CORS IA CV Maker

## Contexte

Le frontend CV Maker appelle le backend IA via :

```text
POST https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app/ai/generate
```

Depuis l'origin frontend :

```text
https://cvmaker-nine-tau.vercel.app
```

Le navigateur bloque l'appel avant meme que la requete POST parte, car la requete preflight `OPTIONS` ne recoit pas les headers CORS attendus.

## Symptomes observes

Console navigateur :

```text
Access to fetch at .../ai/generate from origin ... has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Erreur cote UI :

```text
Backend IA inaccessible. Verifiez VITE_BACKEND_URL, CORS et la protection Vercel.
```

## Historique du diagnostic

1. Premiere erreur :

```text
Redirect is not allowed for a preflight request
```

Cause identifiee :
le backend Vercel renvoyait une redirection vers `vercel.com/sso-api`, donc la protection Vercel etait active.

2. Apres desactivation de la protection :

```text
No 'Access-Control-Allow-Origin' header is present
```

Cause identifiee :
le backend Express etait atteint, mais le middleware CORS ne renvoyait pas les headers sur `OPTIONS /ai/generate` pour l'origin preview actuelle.

3. Test terminal effectue :

```bash
curl -i -X OPTIONS "https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app/ai/generate" \
  -H "Origin: https://cvmaker-nine-tau.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,x-user-id"
```

Resultat avant correction :

```text
HTTP/1.1 500 Internal Server Error
```

Cela confirme que le preflight CORS echoue cote backend.

## Cause racine

Le middleware `cors` deleguait la decision CORS a une fonction dynamique. Quand l'origin n'etait pas acceptee exactement ou quand Vercel executait un preflight preview, Express pouvait retourner une erreur sans header `Access-Control-Allow-Origin`.

En production, cela bloque totalement les appels IA car le navigateur impose CORS avant le POST.

## Elements non lies au bug

Les logs suivants viennent tres probablement d'une extension navigateur :

```text
contentscript.js MaxListenersExceededWarning
ObjectMultiplex - orphaned data
```

Ils ne viennent pas du code CV Maker.

Le log Locize d'i18next est informatif et non bloquant.

