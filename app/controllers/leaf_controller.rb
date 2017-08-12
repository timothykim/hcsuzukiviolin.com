class LeafController < ApplicationController
  def editor
    if params[:name] and not params[:name].blank?
      @content = Content.f(params[:name])
      @referral = params[:url]
    end
  end

  def content_save
    content = params["content"]
    c = Content.f(content["name"])
    c.html = content["html"]
    c.save
    redirect_to params["referral"]
  end
end
