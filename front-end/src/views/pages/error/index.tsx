import { Component } from 'react';

export class NotFoundPage extends Component {
  render() {
    return <div className="not-found-page">page not found</div>;
  }
}

export class ErrorPage extends Component<{ message?: string }> {
  render() {
    return (
      <div className="not-found-page">
        {this.props.message ||
          'There are some error, we are checking and come back soon!'}
      </div>
    );
  }
}
