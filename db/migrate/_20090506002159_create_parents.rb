class CreateParents < ActiveRecord::Migration
  def self.up
    create_table :parents do |t|
      t.column :prefix,           :string
      t.column :first_name,       :string
      t.column :middle_initial,   :string, :limit => 1
      t.column :last_name,        :string
      t.column :street_address,   :string
      t.column :zip,              :string, :limit => 10
      t.column :email,            :string
      t.column :home_phone,       :string
      t.column :work_phone,       :string
      t.column :mobile_phone,     :string
      t.column :spouse_id,        :integer
    end
  end

  def self.down
    drop_table :parents
  end
end
