class CreateComments < ActiveRecord::Migration
  def self.up
    create_table :comments do |t|
      t.column :user_id, :integer
      t.column :photo_id, :integer
      t.column :content, :text
      t.timestamps
    end
  end

  def self.down
    drop_table :comments
  end
end
