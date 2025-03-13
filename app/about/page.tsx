export default function About() {
  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
        About
      </h1>
      <p className="text-xl mb-8 text-gray-900">
        Hi! I'm Dario, the creator of 404 Love Found. The aim of this site is to
        transform the "404 Not Found" pages into opportunities to help adoptable
        pets find homes. Instead of a blank error page, users will see local
        pets who need a family.
      </p>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">How it works</h2>
      <p className="text-xl mb-8 text-gray-900">
        Websites can edit their 404 error pages to redirect to{" "}
        <a href="https://404found.love" className="underline">
          https://404found.love
        </a>
        , and users will be introduced to pets available for adoption in their
        area. These pets come from the{" "}
        <a href="https://rescuegroups.org/" className="underline">
          RescueGroups.org
        </a>{" "}
        database, and are updated daily. A back button is included so users can
        easily return to where they came from.
      </p>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">The story</h2>
      <p className="text-xl mb-8 text-gray-900">
        This project was born from the idea that every little opportunity can
        make a difference. After adopting Sammie I realized how much a pet can
        enrich life. I wanted to help other animals find the same joy and
        security in a loving home.
      </p>
      <p className="text-xl mb-8 text-gray-900">
        Can increasing awareness of pets in need help increase adoptions? That's
        the question I'm trying to answer, hence this site.
      </p>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Join</h2>
      <p className="text-xl mb-8 text-gray-900">
        If you want more customizability, you can fork the{" "}
        <a
          href="https://github.com/dariorapisardi/404lovefound"
          className="underline"
        >
          GitHub repository
        </a>{" "}
        and make your own changes.
      </p>
      <p className="text-xl mb-8 text-gray-900">
        Thank you for your interest in helping pets find homes!
      </p>
    </div>
  )
}
