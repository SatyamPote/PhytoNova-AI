import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import SectionWrapper from '../../components/ui/SectionWrapper';

const testimonials = [
  {
    quote:
      "PhytoNova AI saved my entire tomato harvest. The disease was detected early enough that I could apply treatment before it spread. Incredible tool for any farmer.",
    name: 'Maria Gonzalez',
    role: 'Organic Farmer, Spain',
    initials: 'MG',
    color: 'bg-primary/20 text-primary',
  },
  {
    quote:
      "The AI detection accuracy is remarkable. I used to rely on guesswork, but now I have scientific backing for every treatment decision. My crop yield improved by 35%.",
    name: 'Kwame Asante',
    role: 'Agri-Tech Consultant, Ghana',
    initials: 'KA',
    color: 'bg-secondary/20 text-secondary',
  },
  {
    quote:
      "The marketplace combined with disease detection makes this a one-stop platform. I found the right fertilizer for my condition and got treatment all in one place.",
    name: 'Priya Sharma',
    role: 'Greenhouse Owner, India',
    initials: 'PS',
    color: 'bg-primary/20 text-primary',
  },
];

function TestimonialsSection() {
  return (
    <SectionWrapper className="bg-background">
      <div className="text-center mb-14">
        <motion.p
          className="text-primary font-medium text-sm uppercase tracking-widest mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Testimonials
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-slate-50"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Loved by Farmers Worldwide
        </motion.h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.14, duration: 0.55, ease: 'easeOut' }}
          >
            <GlassCard className="p-7 h-full flex flex-col hover:bg-white/12 transition-colors duration-300">
              {/* Quote icon */}
              <svg
                className="w-8 h-8 text-primary/40 mb-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${testimonial.color}`}>
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-slate-50 font-medium text-sm">{testimonial.name}</div>
                  <div className="text-slate-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export default TestimonialsSection;