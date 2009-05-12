class CreateRegisteredGroupClasses < ActiveRecord::Migration
  def self.up
    create_table :registered_group_classes do |t|
      t.column :registration_id, :integer
      t.column :class_date, :date
    end
  end

  def self.down
    drop_table :registered_group_classes
  end
end
