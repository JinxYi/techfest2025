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
          Our project focuses on creating a web application that detects
          deepfake images and videos, identifies AI-generated content, and
          fact-checks online information.
          <br />
          <br />
          Users can upload media, which is then analyzed to determine if it has
          been manipulated. Additionally, the system cross-references content
          with reliable sources for verification. Our goal is to empower users
          with knowledge, making deepfake detection and fact-checking more
          accessible, while combating misinformation and fostering a more
          informed, responsible digital society.{" "}
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
