import { Component, Context, PropsWithChildren } from 'react';
import { preventMouseEvent } from '../../utils';
import {
  AccountType,
  MentorBaseResponseDto,
  StudentBaseResponseDto,
} from './../../definition';
import { ApplicationContext } from '../../data';

export class ListComponent<
  T extends MentorBaseResponseDto | StudentBaseResponseDto
> extends Component<
  {
    title: string;
    getId: (item: T) => string;
    items: T[];
    currentPage: number;
    totalPage: number;
    onOpenItem: (id?: string) => void;
    onLoadData: (pageNumber: number) => void;
  } & PropsWithChildren
> {
  static contextType = ApplicationContext;

  render() {
    return (
      <div>
        <div className="list-header">
          <h2>{this.props.title}</h2>
          {(this.context as any).accountInfo?.accountType ===
            AccountType.Admin && (
            <button
              className="btn"
              onClick={preventMouseEvent(this.props.onOpenItem)}
            >
              Create
            </button>
          )}
        </div>
        <div className="list-area">
          <div className="list-row row-header">
            <div className="list-column">Full name</div>
            <div className="list-column">Description</div>
            <div className="list-column">Actions</div>
          </div>
          {(this.props.items || []).map((item) => (
            <div className="list-row" key={this.props.getId(item)}>
              <div className="list-column">{item.fullName}</div>
              <div className="list-column">{item.description}</div>
              <div className="list-column">
                <button
                  onClick={preventMouseEvent(() =>
                    this.props.onOpenItem(this.props.getId(item))
                  )}
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="list-footer">
          <button
            onClick={() => this.props.onLoadData(0)}
            disabled={this.props.currentPage === 0}
          >
            {'<<'}
          </button>
          <button
            onClick={() => this.props.onLoadData(this.props.currentPage - 1)}
            disabled={this.props.currentPage === 0}
          >
            {'<'}
          </button>
          <div>{`${this.props.currentPage + 1} / ${this.props.totalPage}`}</div>
          <button
            onClick={() => this.props.onLoadData(this.props.currentPage + 1)}
            disabled={this.props.currentPage === this.props.totalPage - 1}
          >
            {'>'}
          </button>
          <button
            onClick={() => this.props.onLoadData(this.props.totalPage - 1)}
            disabled={this.props.currentPage === this.props.totalPage - 1}
          >
            {'>>'}
          </button>
        </div>
      </div>
    );
  }
}
