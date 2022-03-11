import axios from "axios";
import React from "react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      query: "",
      todo: [],
      loading: "",
      page: 1
    };
    // this.handleChange = this.handleChange.bind(this)
    // bind is return a function with new context
  }
  handleClick(value) {
    this.setState({
      counter: this.state.counter + value
    });
  }
  componentDidMount() {
    this.getTodo();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      this.getTodo();
    }
  }
  getTodo() {
    const { page } = this.state;
    this.setState({
      loading: true
    });
    axios
      .get("https://gopi-server.herokuapp.com/tasks", {
        params: {
          _limit: 2,
          _page: page
        }
      })
      .then((res) => {
        this.setState({
          todo: res.data,
          loading: false
        });
      });
  }
  handleChange(e) {
    this.setState({
      query: e.target.value
    });
  }

  addTodo() {
    let payload = {
      title: this.state.query,
      status: false
    };
    axios
      .post("https://gopi-server.herokuapp.com/tasks", payload)
      .then((res) => this.getTodo())
      .catch((err) => console.log(err));
  }

  deleteTodo(id) {
    axios
      .delete(`https://gopi-server.herokuapp.com/tasks/${id}`)
      .then((res) => this.getTodo());
  }

  render() {
    const { todo, loading } = this.state;
    return (
      <div>
        <h1>{this.props.title}</h1>
        <h1>Counter:{this.state.counter}</h1>
        <button onClick={() => this.handleClick(1)}>Add</button> &nbsp;
        <button onClick={() => this.handleClick(-1)}>Reduce</button>
        <div
          style={{
            display: "flex",
            marginTop: "10px",
            justifyContent: "center"
          }}
        >
          <input
            value={this.state.query}
            onChange={this.handleChange.bind(this)}
            type="enter something..."
          />
          <button onClick={this.addTodo.bind(this)}>Add Todo</button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            todo &&
            todo.map((item) => (
              <div
                style={{
                  border: "1px solid black",
                  width: "400px",
                  margin: "auto",
                  alignItems: "center",
                  padding: "5px",
                  margin: 2,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div>{item.title}</div>
                <button onClick={() => this.deleteTodo(item.id)}>delete</button>
              </div>
            ))
          )}
        </div>
        {loading ? (
          ""
        ) : (
          <div>
            <button
              onClick={() => this.setState({ page: this.state.page - 1 })}
            >
              prev
            </button>
            <button
              onClick={() => this.setState({ page: this.state.page + 1 })}
            >
              next
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Counter;
