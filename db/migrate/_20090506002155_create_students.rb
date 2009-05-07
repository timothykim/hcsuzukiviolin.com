class CreateStudents < ActiveRecord::Migration
  def self.up
    create_table :students do |t|
      t.column :first_name,       :string
      t.column :middle_initial,   :string, :limit => 1
      t.column :last_name,        :string
      t.column :dob,              :date
      t.column :note,             :text
    end
  end

  def self.down
    drop_table :students
  end
end
