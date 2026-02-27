<#import "template.ftl" as layout>
<@layout.registrationLayout; section>

  <#if section = "header">
    Inscription
  <#elseif section = "form">

  <!-- ============ PANNEAU GAUCHE ============ -->
  <div class="login-pf-header">
    <div class="dots-bg"></div>

    <div>
      <div class="cv-logo">CV</div>
      <h2 class="cv-app-title">CV Maker</h2>
      <p class="cv-app-subtitle">Rejoignez des milliers de personnes<br>qui créent leur CV en ligne</p>

      <div class="cv-features">
        <div class="cv-feature-item">
          <div class="cv-feature-icon">✓</div>
          <div>
            <strong class="cv-feature-label">10+ Templates</strong>
            <span class="cv-feature-desc">Designs professionnels</span>
          </div>
        </div>
        <div class="cv-feature-item">
          <div class="cv-feature-icon">✓</div>
          <div>
            <strong class="cv-feature-label">Export PDF</strong>
            <span class="cv-feature-desc">Haute qualité</span>
          </div>
        </div>
        <div class="cv-feature-item">
          <div class="cv-feature-icon">✓</div>
          <div>
            <strong class="cv-feature-label">100% Gratuit</strong>
            <span class="cv-feature-desc">Sans frais cachés</span>
          </div>
        </div>
      </div>
    </div>

    <p class="cv-footer">© 2024 CV Maker</p>
  </div>

  <!-- ============ PANNEAU DROIT - INSCRIPTION ============ -->
  <div id="kc-content">
    <span class="kc-close-btn" onclick="history.back()">×</span>

    <div id="kc-content-wrapper">

      <h2 class="kc-form-title">Créer un compte</h2>
      <p class="kc-form-subtitle">Rejoignez CV Maker et créez votre CV gratuitement</p>

      <#if message?has_content>
        <div class="alert alert-${message.type}">
          ${kcSanitize(message.summary)?no_esc}
        </div>
      </#if>

      <form id="kc-register-form" action="${url.registrationAction}" method="post">

        <!-- Prénom + Nom en ligne -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">

          <div class="form-group">
            <label for="firstName">Prénom *</label>
            <div class="input-group">
              <span class="input-icon-left">👤</span>
              <input type="text" id="firstName" name="firstName" class="form-control"
                value="${(register.formData.firstName!'')}"
                placeholder="Jean"
              />
            </div>
            <#if messagesPerField.existsError('firstName')>
              <span class="help-block">${kcSanitize(messagesPerField.get('firstName'))?no_esc}</span>
            </#if>
          </div>

          <div class="form-group">
            <label for="lastName">Nom *</label>
            <div class="input-group">
              <span class="input-icon-left">👤</span>
              <input type="text" id="lastName" name="lastName" class="form-control"
                value="${(register.formData.lastName!'')}"
                placeholder="Dupont"
              />
            </div>
            <#if messagesPerField.existsError('lastName')>
              <span class="help-block">${kcSanitize(messagesPerField.get('lastName'))?no_esc}</span>
            </#if>
          </div>

        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email *</label>
          <div class="input-group">
            <span class="input-icon-left">✉</span>
            <input type="email" id="email" name="email" class="form-control"
              value="${(register.formData.email!'')}"
              placeholder="votre@email.com"
            />
          </div>
          <#if messagesPerField.existsError('email')>
            <span class="help-block">${kcSanitize(messagesPerField.get('email'))?no_esc}</span>
          </#if>
        </div>

        <!-- Nom d'utilisateur (si activé) -->
        <#if !realm.registrationEmailAsUsername>
        <div class="form-group">
          <label for="username">Nom d'utilisateur *</label>
          <div class="input-group">
            <span class="input-icon-left">@</span>
            <input type="text" id="username" name="username" class="form-control"
              value="${(register.formData.username!'')}"
              placeholder="mon_pseudo"
            />
          </div>
          <#if messagesPerField.existsError('username')>
            <span class="help-block">${kcSanitize(messagesPerField.get('username'))?no_esc}</span>
          </#if>
        </div>
        </#if>

        <!-- Mot de passe -->
        <div class="form-group">
          <label for="password">Mot de passe *</label>
          <div class="input-group">
            <span class="input-icon-left">🔒</span>
            <input type="password" id="password" name="password" class="form-control"
              placeholder="Minimum 8 caractères"
            />
            <button type="button" class="password-toggle" onclick="togglePassword('password', this)">👁</button>
          </div>
          <#if messagesPerField.existsError('password')>
            <span class="help-block">${kcSanitize(messagesPerField.get('password'))?no_esc}</span>
          </#if>
        </div>

        <!-- Confirmer mot de passe -->
        <div class="form-group">
          <label for="password-confirm">Confirmer le mot de passe *</label>
          <div class="input-group">
            <span class="input-icon-left">🔒</span>
            <input type="password" id="password-confirm" name="password-confirm" class="form-control"
              placeholder="Répétez votre mot de passe"
            />
            <button type="button" class="password-toggle" onclick="togglePassword('password-confirm', this)">👁</button>
          </div>
          <#if messagesPerField.existsError('password-confirm')>
            <span class="help-block">${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}</span>
          </#if>
        </div>

        <!-- Bouton inscription -->
        <div class="kc-btn-wrapper">
          <input type="submit" value="S'inscrire →" class="btn-primary"/>
        </div>

      </form>

      <!-- Lien vers login -->
      <div class="kc-links">
        <p>Déjà un compte ? <a href="${url.loginUrl}">Se connecter</a></p>
      </div>

    </div>
  </div>

  <script>
    function togglePassword(fieldId, btn) {
      var input = document.getElementById(fieldId);
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁' : '🙈';
    }

    document.addEventListener('DOMContentLoaded', function () {
      var page = document.querySelector('.login-pf-page');
      if (page) {
        page.style.display = 'flex';
        page.style.flexDirection = 'row';
      }
    });
  </script>

  </#if>
</@layout.registrationLayout>
