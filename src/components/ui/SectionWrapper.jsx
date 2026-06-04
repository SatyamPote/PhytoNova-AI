function SectionWrapper({ children, className = '' }) {
  return (
    <section className={`w-full px-4 sm:px-6 md:px-8 py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}

export default SectionWrapper;