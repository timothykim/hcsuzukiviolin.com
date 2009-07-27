class AddAddressColumnUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :address, :text, :default => ""
  end

  def self.down
    remove_column :users, :address
  end
end
