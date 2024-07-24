import { motion } from "framer-motion";
import { staggerContainer } from "../utils/motion";

const SectionWrapper = <P extends object>(
  Component: React.FC,
  idName: string
) => {
  const HOC: React.FC<P> = () => {
    return (
      <motion.section
        variants={staggerContainer(0.1, 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <span id={idName}>&nbsp;</span>
        <Component />
      </motion.section>
    );
  };
  return HOC;
};

export default SectionWrapper;
