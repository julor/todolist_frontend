import React, { Component } from 'react';
import { fetchTodos  } from '../actions/todo_actions';
import { connect } from 'react-redux';
import Todo from './todo';
import { ListGroup, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

import FilteredTodosSelector from '../selectors/filtered_todos'

import FilterButtons from '../components/filter_buttons';

class Todolist extends Component {

  componentWillMount() {
    const { show, due, group } = this.props.params;
    this.props.fetchTodos(show, due, group);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.due != this.props.params.due
      || nextProps.params.show != this.props.params.show
      || nextProps.params.group != this.props.params.group)
      this.props.fetchTodos(nextProps.params.show, nextProps.params.due, nextProps.params.group);
  }

  showTodo(todo, idx) {
    return(
      <Todo todo={todo} key={idx} />
    )
  }

  showGroup(group, idx) {
    return(
      <div key={idx}>
        <h3>{group.title}</h3>
        <ListGroup>
          {group.todos.map(this.showTodo.bind(this))}
        </ListGroup>
      </div>
    )
  }

  render() {
    let todos = [];
    if (this.props.todos) { todos = this.props.todos }
    const { show, due, group } = this.props.params;

    return(
      <div>
        <span className="pull-right">
          <FilterButtons show={show} group={group} due={due} />

        </span>
        {this.renderTodos(todos)}
      </div>
    )
  }

  renderTodos(todos) {
    if (todos.length == 0) {
      return <p>No todos.</p>
    }
    return todos.map(this.showGroup.bind(this))
  }

  _filterAndGroup(todos, show, due, group) {
    let showFilter = new ShowFilter(todos)
    let dateFilter = new DateFilter(showFilter.filterBy(show));
    let grouper = new Grouper(dateFilter.filterBy(due));
    return grouper.grouped(group)
  }

}

function mapStateToProps(state, ownProps) {
  return {
    todos: FilteredTodosSelector(state, ownProps)
  }
}

export default connect(mapStateToProps, { fetchTodos })(Todolist);
