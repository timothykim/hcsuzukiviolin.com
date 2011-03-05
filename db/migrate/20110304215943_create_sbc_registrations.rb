class CreateSbcRegistrations < ActiveRecord::Migration
  def self.up
    create_table :sbc_registrations do |t|
      t.column :student_id, :integer
      t.column :approved, :boolean, :default => false
      t.timestamps
    end
  end

  def self.down
    drop_table :sbc_registrations
  end
end
