class CreateSummerStudents < ActiveRecord::Migration
  def self.up
    create_table :summer_students do |t|
      t.column :name, :string
      t.column :school_id, :integer
      t.column :lesson_duration, :integer
      t.timestamps
    end    
  end

  def self.down
    drop_table :summer_students
  end
end


