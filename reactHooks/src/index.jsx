import React, {Component} from "react";
import ReactDOM from "react-dom";
// import BaseHook from "./component/BaseHook";
// import Form from "./component/hookToForm/index";
import Test from "./component/useCallbackAnduseMemo";
class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {/* <BaseHook /> */}
        {/* <Form>
          <input />
        </Form> */}
        <Test />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector("#app")
)