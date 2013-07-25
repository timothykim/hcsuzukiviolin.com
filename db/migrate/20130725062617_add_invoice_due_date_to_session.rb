class AddInvoiceDueDateToSession < ActiveRecord::Migration
  def self.up
    add_column :sessions, :invoice_due, :date
  end

  def self.down
    remove_column :sessions, :invoice_due
  end
end
