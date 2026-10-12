import { Link } from 'react-router-dom'
import InfoPage from '../components/InfoPage'

function Terms() {
  return (
    <InfoPage label="Please read" title="Terms of Use" updatedAt="October 11, 2026">
      <p>
        By accessing GameVerse, you agree to these terms. If you do not agree,
        please do not use the site.
      </p>

      <h2>Using GameVerse</h2>
      <p>
        GameVerse provides a directory and browser interface for online games.
        You may use the site for personal, lawful purposes. You agree not to
        misuse the site, interfere with its operation, or attempt to access it
        in a way that could harm the service or other users.
      </p>

      <h2>Third-party games and services</h2>
      <p>
        Games and some other content are provided by third parties. They may
        have their own terms, privacy policies, age guidance, and availability.
        GameVerse does not control or guarantee third-party content, and your
        use of it is at your discretion.
      </p>

      <h2>Availability and warranties</h2>
      <p>
        GameVerse is provided on an “as is” and “as available” basis. We may
        change, suspend, or remove features or games at any time. To the extent
        permitted by law, we make no warranties about uninterrupted
        availability, accuracy, or suitability of the site or third-party
        content.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, GameVerse is not liable for losses or
        damages resulting from your use of, or inability to use, the site or
        third-party games and services.
      </p>

      <h2>Changes and contact</h2>
      <p>
        These terms may be updated as the site changes. Continued use after an
        update means you accept the revised terms. For questions, please visit
        our <Link to="/contact">Contact page</Link>.
      </p>
    </InfoPage>
  )
}

export default Terms
