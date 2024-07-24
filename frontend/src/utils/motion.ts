export const staggerContainer = (
  staggerChildren: number,
  delayChildren: number = 0
) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delayChildren,
      },
    },
  };
};
