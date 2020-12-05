import { v4 } from 'uuid';
import joinClassName from 'js/utils/joinClassName';
import cssClassModifier from 'js/utils/cssClassModifier';
import safety from 'js/utils/safety';

const TableContainer = ({ className, headers, data, onRowClick }) => (
  <table className={joinClassName('table-container', className)}>
    <thead className="table__head">
      <tr>
        {headers.map(
          ({ customClass = '', label, customLabel: CustomLabel }) => (
            <th
              className={joinClassName('table__heading', customClass)}
              key={v4()}>
              {CustomLabel ? <CustomLabel /> : label}
            </th>
          )
        )}
      </tr>
    </thead>
    <tbody className="table__body">
      {data.map((item) => (
        <tr
          className={cssClassModifier(
            'table__row',
            ['clickable'],
            [onRowClick]
          )}
          onClick={() => onRowClick && onRowClick(item)}
          key={v4()}>
          {headers.map(({ customClass, accessKey, customCell: Cell }) => {
            const value = accessKey ? safety(item, accessKey, null) : item;

            return (
              <td
                className={joinClassName('table__cell', customClass)}
                key={v4()}>
                {Cell ? <Cell key={accessKey} value={value} /> : value}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

export default TableContainer;
