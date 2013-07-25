class CreateInvoices < ActiveRecord::Migration
  def self.up
    create_table :invoices do |t|
      t.column :registration_id, :integer
      t.column :sent, :boolean, :default => :false
      t.column :sent_date, :date
      t.column :message, :text
      t.timestamps
    end
  end

  def self.down
    drop_table :invoices
  end
end
