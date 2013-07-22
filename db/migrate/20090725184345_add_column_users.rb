class AddColumnUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :alternate_email, :string, :default => ""
    add_column :users, :home_phone, :string, :default => ""
    add_column :users, :work_phone, :string, :default => ""
    add_column :users, :mobile_phone, :string, :default => ""
  end

  def self.down
    remove_column :users, :alternate_email
    remove_column :users, :home_phone
    remove_column :users, :work_phone
    remove_column :users, :mobile_phone
  end
end
