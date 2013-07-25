class CreateInvoiceItems < ActiveRecord::Migration
  def self.up
    create_table :invoice_items do |t|
      t.column :invoice_id, :integer
      t.column :description, :string
      t.column :unit_price, :integer, :default => 0
      t.column :quantity, :integer, :default => 0
      t.timestamps
    end
  end

  def self.down
    drop_table :invoice_items
  end
end
