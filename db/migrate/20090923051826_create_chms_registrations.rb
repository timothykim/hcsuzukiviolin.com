class CreateChmsRegistrations < ActiveRecord::Migration
  def self.up
    create_table :chms_registrations do |t|
      t.column :firstname,    :string
      t.column :lastname,     :string
      t.column :email,        :string
      t.column :address,      :string
      t.column :home_phone,   :string
      t.column :work_phone,   :string
      t.column :mobile_phone,   :string
      t.column :student_firstname, :string
      t.column :student_lastname, :string
      t.column :student_dob, :date
      t.column :comments, :text
      t.column :chms_hours, :string
      t.column :active, :boolean

      t.timestamps
    end
  end

  def self.down
    drop_table :chms_registrations
  end
end
