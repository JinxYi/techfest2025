import { Layout } from "@/components/layouts";
import { Link } from "react-router";
import "./Button.css";
import "./card.css";

function App() {
  return (
    <Layout>
      <div className="card">
        <div className="background"></div>
        <div className="logo">
          We are here to help fight misinformation by helping every individual check what they are reading is correct
        </div>
        <Link to="/deepfake-detection">
          <div className="box box1">
            <span className="icon" style={{ color: "#000000" }}>
              Deepfake Image/Video Detection
            </span>
          </div>
        </Link>
        <Link to="/fact-check">
          <div className="box box2">
            <span className="icon" style={{ color: "#000000" }}>
              Textual Fact-Check
            </span>
          </div>
        </Link>
      </div>
      
      {/* Social Media Icons */}
      
    </Layout>
  );
}

export default App;
