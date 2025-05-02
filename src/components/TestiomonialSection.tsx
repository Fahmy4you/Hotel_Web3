import TitleHeader from '@/components/TitleHeader';
import GlowCard from '@/components//GlowCard';
const TestiomonialSection = ({title = 'Bagaimana Orang Menilai ?', sub = "Testimonials User Kami 🤩"}: {title?: string, sub?: string}) => {
    const testimonials = [
        {
          name: "Esther Howard",
          mentions: "@estherhoward",
          bintang: 5,
          review:
            "I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
          imgPath: "/image/users/client1.png",
        },
        {
          name: "Wade Warren",
          mentions: "@wadewarren",
          bintang: 4,
          review:
            "Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
          imgPath: "/image/users/client3.png",
        },
        {
          name: "Guy Hawkins",
          mentions: "@guyhawkins",
          bintang: 2,
          review:
            "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
          imgPath: "/image/users/client2.png",
        },
        {
          name: "Marvin McKinney",
          mentions: "@marvinmckinney",
          bintang: 3,
          review:
            "Adrian was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
          imgPath: "/image/users/client5.png",
        },
        {
          name: "Floyd Miles",
          mentions: "@floydmiles",
          bintang: 4,
          review:
            "Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
          imgPath: "/image/users/client4.png",
        },
        {
          name: "Albert Flores",
          mentions: "@albertflores",
          bintang: 5,
          review:
            "Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
          imgPath: "/image/users/client6.png",
        },
      ];

  return (
    <section id="testimonial" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader title={title} sub={sub}/>
        <div className="lg:columns-3 md:columns-2 columns-1 mt-16">
            {testimonials.map((testimonial, i) => (
                <GlowCard key={i} card={{review: testimonial.review, bintang:  testimonial.bintang}} index={i}>
                    <div className='flex items-center gap-3'>
                        <div>
                            <img src={testimonial.imgPath} alt={testimonial.imgPath} />
                        </div>
                        <div>
                            <p className='font-bold'>{testimonial.name}</p>
                            <p className='text-white-50'>{testimonial.mentions}</p>
                        </div>
                    </div>
                </GlowCard>
            ))}
        </div>
      </div>
    </section>
  )
}

export default TestiomonialSection
