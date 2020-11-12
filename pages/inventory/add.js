import Layout from 'components/layout/layout';
import FormTitle from 'components/form-title/form-title';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';
import Button from 'components/button/button';

const InventoryAdd = () => (
  <Layout>
    <div className="inventory-add">
      <div className="inventory-add-top">
        <div className="inventory-add-container grid">
          <FormTitle icon="archive" title="Add Item" />
        </div>
        <div className="inventory-add-actions">
          <div className="grid">
            <Button>
              Cancel
            </Button>
            <Button variant="primary">
              Update item
            </Button>
          </div>
        </div>
      </div>
      <div className="inventory-add-container grid">
        <FormSection title="References">
          <InputGroup name="number" label="Number" />
        </FormSection>
      </div>
    </div>
  </Layout>
);

export default InventoryAdd;
