class SiteOptionMail < ActiveRecord::Migration
  def self.up
    Option.create :name => "Sign-up Notification", :value => "true"
  end

  def self.down
  end
end
