class CreateRegistrationOptions < ActiveRecord::Migration
  def self.up
    create_table :registration_options do |t|
      t.column :session_id,   :integer
      t.column :text,         :text
      t.column :input_type,   :string
    end
  end

  def self.down
    drop_table :registration_options
  end
end
