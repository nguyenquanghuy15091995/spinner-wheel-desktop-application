import { Divider, H4, Card } from "ui-neumorphism";
import { AppProvider } from "contexts/app-context";
import Wheel from "./Wheel";
import Controller from "./Controller";
import ResultDialog from "./ResultDialog";

const App = () => {
  return <AppProvider>
    <section className="bg-neu-light vh-100 px-4">
      <H4 className="text-center py-4 fw-700">Lucky Spinner Wheel</H4>
      <Divider className="mb-4" />
      <Card className="container-xl py-4">
        <div className="row">
          <div className="col-7 d-flex justify-content-center align-items-center">
            <Wheel />
          </div>
          <div className="col-5">
            <Controller />
          </div>
        </div>
      </Card>
      <ResultDialog />
    </section>
  </AppProvider>;
}

export default App;