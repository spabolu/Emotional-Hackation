import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mx-auto mt-auto w-full py-8">
      <div className="text-center">
        <div>
          <Link href="/" className="flex-none font-semibold md:text-lg">
            MinedTALK
          </Link>
        </div>

        <div className="text-sm sm:inline-flex sm:space-x-2 md:text-base">
          <p className="text-zinc-600">
            501(c)(3) {new Date().getFullYear()} MinedTALK. All Rights Reserved.
          </p>
          <p className="text-zinc-600 underline hover:text-zinc-700">
            <a href="https://www.linkedin.com/in/anishkolan/">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
