import { Component } from 'react';

export * from './profile.page';
export * from './mentors.page';
export * from './students.page';

export class EmptyPage extends Component {
  render() {
    return <div></div>;
  }
}
