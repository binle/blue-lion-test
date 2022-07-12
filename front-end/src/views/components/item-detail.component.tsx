import { useContext, useEffect, useState } from 'react';
import { ApplicationContext } from '../../data';
import {
  AccountType,
  ExtraInfo,
  ItemDetailResponseDto,
} from '../../definition';
import { preventMouseEvent } from '../../utils';

export const ItemDetailComponent = <T extends ItemDetailResponseDto>(props: {
  title: string;
  item?: ItemDetailResponseDto;
  getId: (item: T) => string;
  onClose?: () => void;
  onSave: (
    username: string,
    password: string,
    fullName: string,
    description: string,
    extra?: ExtraInfo[]
  ) => Promise<void>;
  onDelete: () => Promise<void>;
  onChangePassword?: () => Promise<void>;
}) => {
  const { accountInfo } = useContext(ApplicationContext);

  const [item, setItem] = useState<
    ItemDetailResponseDto & { password: string }
  >({
    fullName: props.item?.fullName || '',
    description: props.item?.description || '',
    extra: props.item?.extra || [],
    username: props.item?.username || '',
    password: '',
  });

  useEffect(() => {
    setItem({
      fullName: props.item?.fullName || '',
      description: props.item?.description || '',
      extra: props.item?.extra || [],
      username: props.item?.username || '',
      password: '',
    });
  }, [props.item]);

  const id = props.item ? props.getId(props.item as T) : undefined;

  return (
    <div className="detail-modal">
      <div className="modal-content">
        <div className="modal-header">
          <div>{props.title} </div>
          {!!props.onClose && <button onClick={props.onClose}>Close</button>}
        </div>
        <div className="modal-form">
          <form>
            <div className="form-input">
              {accountInfo?.accountType === AccountType.Admin && (
                <>
                  <h3>Account Information</h3>
                  <div className="form-input-row">
                    <label className="input-label">Username</label>
                    <input
                      className="input-value"
                      value={item.username || ''}
                      onChange={(event) =>
                        setItem({ ...item, username: event.target.value })
                      }
                    />
                  </div>

                  <div className="form-input-row">
                    <label className="input-label">Password</label>
                    <input
                      placeholder={id ? 'Input to set password' : ''}
                      className="input-value"
                      type={'password'}
                      value={item.password || ''}
                      onChange={(event) =>
                        setItem({ ...item, password: event.target.value })
                      }
                    />
                  </div>
                </>
              )}

              <h3>Profile Information</h3>
              <div className="form-input-row">
                <label className="input-label">Full Name</label>
                <input
                  className="input-value"
                  value={item.fullName || ''}
                  disabled={accountInfo?.accountType !== AccountType.Admin}
                  onChange={(event) =>
                    setItem({ ...item, fullName: event.target.value })
                  }
                />
              </div>
              <div className="form-input-row">
                <label className="input-label">Description</label>
                <input
                  className="input-value"
                  value={item.description || ''}
                  disabled={accountInfo?.accountType !== AccountType.Admin}
                  onChange={(event) =>
                    setItem({ ...item, description: event.target.value })
                  }
                />
              </div>
              <div className="extra-information">
                <span>
                  <p>Extra information</p>
                  {accountInfo?.accountType === AccountType.Admin && (
                    <button
                      className="extra-information-add-button"
                      onClick={() => {
                        item.extra = item.extra || [];
                        item.extra.push({ key: '', value: '' });
                        setItem({ ...item });
                      }}
                      type="button"
                    >
                      Add
                    </button>
                  )}
                </span>
                {accountInfo?.accountType === AccountType.Admin && (
                  <div className="form-input-row">
                    <label className="extra-header-label">Key</label>
                    <label className="extra-header-value">Value</label>
                  </div>
                )}
                {(item.extra || []).map((extraItem, index) => (
                  <div className="form-input-row" key={index}>
                    <input
                      className="extra-label"
                      value={extraItem.key || ''}
                      disabled={accountInfo?.accountType !== AccountType.Admin}
                      onChange={(event) => {
                        (item.extra || [])[index].key = event.target.value;
                        setItem({ ...item });
                      }}
                    />
                    <input
                      className="extra-value"
                      value={extraItem.value || ''}
                      disabled={accountInfo?.accountType !== AccountType.Admin}
                      onChange={(event) => {
                        (item.extra || [])[index].value = event.target.value;
                        setItem({ ...item });
                      }}
                    />
                  </div>
                ))}
              </div>
              {accountInfo?.accountType === AccountType.Admin && (
                <div>
                  <button
                    type="submit"
                    className="form-submit"
                    onClick={preventMouseEvent(() =>
                      props?.onSave(
                        item.username,
                        item.password,
                        item.fullName,
                        item.description as string,
                        item.extra
                      )
                    )}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="form-button"
                    onClick={preventMouseEvent(props.onDelete)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
