import cssClassModifier from 'js/utils/cssClassModifier';
import { defaultLimits } from 'js/shapes/table';
import Select from 'components/select/select';
import Icon from 'components/icon/icon';
import Button from 'components/button/button';

const TableFooter = ({ currentPage, totalPages, onPageChange }) => (
  <div className="table-footer">
    <div className="table-footer-limit">
      <span className="table-footer-limit__text">Limit to</span>
      <Select
        id="limit"
        name="limit"
        options={defaultLimits}
        mainKey="value"
        noEmpty
      />
    </div>
    <div className="table-footer-pagination">
      <button
        className="table-footer-pagination__left"
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}>
        <Icon icon="chevron-down" />
      </button>
      <ul className="table-footer-pagination__numbers">
        {Array.from({ length: 3 }).map((_, index) => {
          const pageNum = currentPage + index;

          return (
            <li key={index}>
              <Button
                className={cssClassModifier(
                  'table-footer-pagination__number',
                  ['active'],
                  [currentPage === pageNum]
                )}
                onClick={() => onPageChange(pageNum)}
                disabled={pageNum > totalPages}>
                {pageNum}
              </Button>
            </li>
          );
        })}
      </ul>
      <button
        className="table-footer-pagination__right"
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}>
        <Icon icon="chevron-down" />
      </button>
    </div>
  </div>
);

export default TableFooter;
