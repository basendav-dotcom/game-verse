import InfoPage from '../components/InfoPage'

function Contact() {
  return (
    <InfoPage label="Get in touch" title="Contact GameVerse">
      <p>
        Have a question, found a problem, or want to suggest a game? We welcome
        feedback about GameVerse.
      </p>
      <p>
        The best way to reach us is through the{' '}
        <a href="https://github.com/basendav-dotcom/game-verse/issues">
          GameVerse issue tracker on GitHub
        </a>
        . Please describe what happened and which page or game you were using.
      </p>
      <p>
        Please don’t post passwords, payment details, or other sensitive
        personal information in a public issue.
      </p>
    </InfoPage>
  )
}

export default Contact
