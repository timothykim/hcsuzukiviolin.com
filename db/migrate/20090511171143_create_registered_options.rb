class CreateRegisteredOptions < ActiveRecord::Migration
  def self.up
    create_table :registered_options do |t|
      t.column :registration_id, :integer
      t.column :option_id, :integer
      t.column :value, :text, :default => ""
    end
  end

  def self.down
    drop_table :registered_options
  end
end
