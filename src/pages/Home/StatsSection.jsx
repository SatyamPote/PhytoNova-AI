import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import SectionWrapper from '../../components/ui/SectionWrapper';

const stats = [
  { value: 50000, suffix: '+', label: 'Plants Analyzed', description: 'Trusted by farmers worldwide' },
  { value: 98, suffix: '%', label: 'Detection Accuracy', description: 'State-of-the-art AI models' },
  { value: 120, suffix: '+', label: 'Disease Classes', description: 'Comprehensive crop coverage' },
  { value: 30, suffix: 's', label: 'Avg. Analysis Time', description: 'Fast, real-time results' },
];

function AnimatedCounter({ target, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <SectionWrapper className="bg-slate-900/50">
      <div className="text-center mb-12">
        <motion.p
          className="text-secondary font-medium text-sm uppercase tracking-widest mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          By the Numbers
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-slate-50"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Trusted Worldwide
        </motion.h2>
      </div>

      <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <GlassCard className="p-6 sm:p-8 text-center hover:bg-white/12 transition-colors duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-slate-50 mb-1">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <div className="text-primary font-semibold text-sm sm:text-base mb-1">{stat.label}</div>
              <div className="text-slate-500 text-xs">{stat.description}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export default StatsSection;