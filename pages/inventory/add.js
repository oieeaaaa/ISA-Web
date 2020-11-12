import Layout from 'components/layout/layout';
import FormTitle from 'components/form-title/form-title';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';

const InventoryAdd = () => (
  <Layout>
    <div className="inventory-add">
      <div className="inventory-add-container grid">
        <FormTitle icon="archive" title="Add Item" />
        <FormSection title="References">
          <InputGroup name="number" label="Number" />
        </FormSection>
      </div>
    </div>
  </Layout>
);

export default InventoryAdd;
