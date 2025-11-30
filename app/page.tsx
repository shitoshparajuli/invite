import Image from 'next/image';
import RSVPForm from './components/RSVPForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Photo */}
      <section className="relative h-screen">
        {/* Replace the gradient with your actual hero photo by uncommenting Image below */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <Image
            src="/main-photo.jpg"
            alt="Couple photo"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <p className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-light">
              Save the Date
            </p>
            <h1 className="text-white text-6xl md:text-8xl mb-8 font-light tracking-tight">
              Samikshya & Shitosh
            </h1>
            <div className="w-20 h-px bg-white/50 mx-auto mb-8"></div>
            <p className="text-white/90 text-xl md:text-2xl font-light">
              March 12, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-8 font-light tracking-tight text-gray-900">
            Join Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
            We invite you to celebrate with us as we begin our journey together.
            Your presence would mean the world to us.
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div>
              <h3 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-4 font-medium">
                Ceremony
              </h3>
              <p className="text-2xl text-gray-900 mb-2 font-light">[Time]</p>
              <p className="text-gray-600">[Venue Name]</p>
              <p className="text-sm text-gray-500 mt-2">[Address]</p>
            </div>
            <div>
              <h3 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-4 font-medium">
                Reception
              </h3>
              <p className="text-2xl text-gray-900 mb-2 font-light">[Time]</p>
              <p className="text-gray-600">[Venue Name]</p>
              <p className="text-sm text-gray-500 mt-2">[Address]</p>
            </div>
            <div>
              <h3 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-4 font-medium">
                Dress Code
              </h3>
              <p className="text-2xl text-gray-900 mb-2 font-light">[Dress Code]</p>
              <p className="text-gray-600">Optional subtitle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Replace gradients with your actual photos */}
            <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300">
              {/* <Image
                src="/photo-1.jpg"
                alt="Photo 1"
                fill
                className="object-cover"
              /> */}
            </div>
            <div className="relative h-96 bg-gradient-to-br from-gray-300 to-gray-200">
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
      <section className="py-24 px-4 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-4 font-light tracking-tight">RSVP</h2>
            <p className="text-gray-400 text-lg font-light">
              Kindly respond by [RSVP Date]
            </p>
          </div>

          <RSVPForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center bg-black text-gray-500 text-sm tracking-wider">
        <p>We look forward to celebrating with you</p>
      </footer>
    </div>
  );
}
