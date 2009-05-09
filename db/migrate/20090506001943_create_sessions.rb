class CreateSessions < ActiveRecord::Migration
  def self.up
    create_table :sessions do |t|
      t.column :name,               :string
      t.column :first,              :date 
      t.column :last,               :date
      t.column :is_active,          :boolean
      t.column :registration_notes, :text
    end
  end

  def self.down
    drop_table :sessions
  end
end
