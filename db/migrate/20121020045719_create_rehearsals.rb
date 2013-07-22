class CreateRehearsals < ActiveRecord::Migration
  def self.up
    create_table :rehearsals do |t|
      t.column :time, :datetime
      t.column :student_id, :integer
      t.column :piece, :text
      t.column :location, :text
      t.timestamps
    end
  end

  def self.down
    drop_table :rehearsals
  end
end
