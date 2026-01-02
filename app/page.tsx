import Image from 'next/image';
import RSVPForm from './components/RSVPForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Photo */}
      <section className="relative h-[70vh] md:h-screen">
        {/* Replace the gradient with your actual hero photo by uncommenting Image below */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <Image
            src="/main-photo.jpg"
            alt="Couple photo"
            fill
            className="object-cover object-center opacity-60"
            priority
          />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <p className="text-white/90 text-xs md:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 md:mb-6 font-light">
              Save the Date
            </p>
            <h1 className="text-white text-4xl md:text-6xl lg:text-8xl mb-6 md:mb-8 font-light tracking-tight leading-tight">
              Samikshya & Shitosh
            </h1>
            <div className="w-16 md:w-20 h-px bg-white/50 mx-auto mb-4 md:mb-8"></div>
            <p className="text-white/90 text-lg md:text-xl lg:text-2xl font-light">
              March 12, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 font-light tracking-tight text-gray-900">
            If you're reading this...
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed font-light">
            ...it means you've been a part of our story, and we can't imagine this chapter without you.
            We'd love to have you there. It wouldn't be the same without you.
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12 md:py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 text-center">
            <div>
              <h3 className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-400 mb-3 md:mb-4 font-medium">
                Wedding Ceremony
              </h3>
              <p className="text-xl md:text-2xl text-gray-900 mb-2 font-light">March 12, 2026</p>
              <p className="text-base md:text-lg text-gray-600">Lemon Tree Premier</p>
              <p className="text-sm text-gray-500 mt-2">Budhanilkantha, Kathmandu, Nepal</p>
            </div>
            <div>
              <h3 className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-400 mb-3 md:mb-4 font-medium">
                Reception
              </h3>
              <p className="text-xl md:text-2xl text-gray-900 mb-2 font-light">March 16, 2026</p>
              <p className="text-base md:text-lg text-gray-600">City Hall Ilam</p>
              <p className="text-sm text-gray-500 mt-2">Ilam, Nepal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-12 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {/* Replace gradients with your actual photos */}
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-gray-200 to-gray-300">
              {/* <Image
                src="/photo-1.jpg"
                alt="Photo 1"
                fill
                className="object-cover"
              /> */}
            </div>
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-gray-300 to-gray-200">
              {/* <Image
                src="/photo-2.jpg"
                alt="Photo 2"
                fill
                className="object-cover"
              /> */}
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-12 md:py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 font-light tracking-tight">RSVP</h2>
            <p className="text-gray-400 text-base md:text-lg font-light">
              Kindly respond by [RSVP Date]
            </p>
          </div>

          <RSVPForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-6 text-center bg-black text-gray-500 text-xs md:text-sm tracking-wider">
        <p>We look forward to celebrating with you</p>
      </footer>
    </div>
  );
}
