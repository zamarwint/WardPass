import { PaymentCard } from "@/app/_components/UICards";

// ABOUT SECTION

export default function About() {
  return (
    <section
      id="about"
      className="border-y border-foreground/5 w-full py-30 px-4 md:px-10 font-geist"
    >
      <div className="flex flex-col md:flex-row mx-auto items-center justify-around gap-10 md:gap-0">
        <div className="w-64 md:w-2/6 text-center md:text-left flex flex-col gap-15">
          <h2 className="text-2xl md:text-8xl font-bold text-primary">
            What is WardPass?
          </h2>
          <div className="flex flex-col gap-8 text-xl">
            <p>
              WardPass is a secure password management solution. With WardPass,
              you can easily organize your passwords into different folders
              called <b>Vaults</b>, and use them when you want to sign in to any
              service.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <PaymentCard />
        </div>
      </div>
    </section>
  );
}
