import Maxwidth from "@/components/Maxwidth";
import Steps from "@/components/Steps";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Maxwidth className="flex flex-1 flex-col">
      <Steps />
      {children}
    </Maxwidth>
  );
};

export default Layout;
