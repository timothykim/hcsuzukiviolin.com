class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|
      t.column :school_id, :integer
      t.column :room, :string
      t.timestamps
    end
  end

  def self.down
    drop_table :locations
  end
end
