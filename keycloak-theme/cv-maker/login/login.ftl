<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>

  <#if section = "header">
    Connexion
  <#elseif section = "form">

  <!-- ============ PANNEAU GAUCHE ============ -->
  <div class="login-pf-header">
    <div class="dots-bg"></div>

    <div>
      <div class="cv-logo">CV</div>
      <h2 class="cv-app-title">CV Maker</h2>
      <p class="cv-app-subtitle">Créez votre CV professionnel<br>en quelques minutes</p>

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

  <!-- ============ PANNEAU DROIT ============ -->
  <div id="kc-content">
    <span class="kc-close-btn" onclick="history.back()">×</span>

    <div id="kc-content-wrapper">

      <h2 class="kc-form-title">Connexion</h2>
      <p class="kc-form-subtitle">Connectez-vous pour accéder à vos CV sauvegardés</p>

      <#if message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
        <div class="alert alert-${message.type}">
          ${kcSanitize(message.summary)?no_esc}
        </div>
      </#if>

      <form id="kc-form-login" action="${url.loginAction}" method="post">

        <!-- Email / Username -->
        <div class="form-group">
          <label for="username">
            <#if !realm.loginWithEmailAllowed>Nom d'utilisateur<#elseif !realm.registrationEmailAsUsername>Email ou nom d'utilisateur<#else>Email</#if>
          </label>
          <div class="input-group">
            <span class="input-icon-left">✉</span>
            <input tabindex="1" id="username" name="username" type="text"
              class="form-control" autofocus
              value="${(login.username!'')}"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <!-- Mot de passe -->
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="input-group">
            <span class="input-icon-left">🔒</span>
            <input tabindex="2" id="password" name="password" type="password"
              class="form-control"
              placeholder="••••••••••••"
            />
            <button type="button" class="password-toggle" onclick="togglePassword('password', this)">👁</button>
          </div>
        </div>

        <!-- Bouton connexion -->
        <div id="kc-form-buttons">
          <input tabindex="4" type="submit" value="Se connecter →" class="btn-primary"/>
        </div>

      </form>

      <!-- Liens -->
      <div class="kc-links">
        <#if realm.registrationAllowed && !registrationDisabled??>
          <p>Pas encore de compte ? <a href="${url.registrationUrl}">S'inscrire</a></p>
        </#if>
        <#if realm.resetPasswordAllowed>
          <a href="${url.loginResetCredentialsUrl}" class="forgot-link">Mot de passe oublié ?</a>
        </#if>
      </div>

    </div>
  </div>

  <script>
    function togglePassword(fieldId, btn) {
      var input = document.getElementById(fieldId);
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁' : '🙈';
    }

    // Appliquer le split layout sur login-pf-page
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
