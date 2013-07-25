class AddInvoiceMessageDateToSession < ActiveRecord::Migration
  def self.up
    add_column :sessions, :invoice_message, :text
  end

  def self.down
    remove_column :sessions, :invoice_message
  end
end
