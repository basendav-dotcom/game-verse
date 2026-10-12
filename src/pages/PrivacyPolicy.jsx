import { Link } from 'react-router-dom'
import InfoPage from '../components/InfoPage'

function PrivacyPolicy() {
  return (
    <InfoPage label="Your privacy" title="Privacy Policy" updatedAt="October 11, 2026">
      <p>
        This policy explains how GameVerse handles information when you visit
        this website. GameVerse is a browser-based game directory and does not
        require you to create an account.
      </p>

      <h2>Information stored by GameVerse</h2>
      <p>
        GameVerse saves the game listings loaded on the home page in your
        browser’s local storage so that a selected game can be opened. This
        information stays in your browser and can be removed by clearing the
        site’s stored data in your browser settings.
      </p>

      <h2>Third-party services and games</h2>
      <p>
        The site requests game catalog information from Playgama and
        GameDistribution and loads games hosted by third parties. When your
        browser connects to these services or plays an embedded game, those
        providers may receive technical information such as your IP address
        and browser details, and may handle information according to their own
        privacy policies.
      </p>
      <p>
        GameVerse also loads Google AdSense advertising scripts and Google
        Fonts. Google and other advertising or content providers may use
        cookies or similar technologies in connection with their services.
        Their collection and use of information is governed by their own
        policies and settings.
      </p>

      <h2>Your choices</h2>
      <p>
        You can clear local storage and manage cookies through your browser
        settings. You can also choose not to use third-party games or services
        linked from the site. Blocking these technologies or requests may
        affect how some parts of GameVerse work.
      </p>

      <h2>Changes and contact</h2>
      <p>
        This policy may be updated as the site changes. For questions about
        this policy, please use the contact options on our <Link to="/contact">Contact page</Link>.
      </p>
    </InfoPage>
  )
}

export default PrivacyPolicy
