class AddCommentCounters < ActiveRecord::Migration
  def self.up
    add_column :users, :comments_count, :integer, :default => 0, :null => false
    add_column :photos, :comments_count, :integer, :default => 0, :null => false
  end

  def self.down
    remove_column :users, :comments_count
    remove_column :photos, :comments_count
  end
end
