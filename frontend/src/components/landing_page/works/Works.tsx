import { SectionWrapper } from "../../../hoc";

const Works = () => {
  return <div className="bg-[#46443e] h-[100vh] w-full">Works</div>;
};

const WrappedWorks = SectionWrapper(Works, "how-it-works");
export default WrappedWorks;
